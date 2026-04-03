// backend/test/e2e/flow.test.js
import request from 'supertest';
import app from '../../index.js';
import sequelize from '../../src/config/database.js';
import User from '../../src/models/User.js';
import Bet from '../../src/models/Bet.js';

describe('🔄 Fluxo Completo: Cadastro → Login → Aposta → Sorteio', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Limpa e recria tabelas
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('✅ 1. Deve cadastrar um novo usuário', async () => {
    const email = `test_${Date.now()}@example.com`;
    
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email,
        password: 'Test@123456',
        balance: 100.00
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(email);
    
    testUser = res.body.user;
  });

  it('✅ 2. Deve fazer login com o usuário cadastrado', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'Test@123456'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    
    authToken = res.body.token;
  });

  it('✅ 3. Deve realizar uma aposta válida (grupo)', async () => {
    const res = await request(app)
      .post('/api/bets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        bet_type: 'grupo',
        bet_value: '23',  // Urso
        amount: 5.00
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('bet');
    expect(res.body.bet).toMatchObject({
      bet_type: 'grupo',
      bet_value: '23',
      amount: 5.00,
      status: 'pending'
    });
    expect(res.body.newBalance).toBe(95.00); // 100 - 5
  });

  it('✅ 4. Deve processar um sorteio e atualizar o status da aposta', async () => {
    // Forçar um sorteio onde a dezena 91 sai (grupo 23 = Urso)
    // Nota: Em teste real, você mockaria o random ou injetaria o resultado
    const res = await request(app)
      .post('/api/draws/simulate')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('stats');
    
    // Verificar se a aposta foi atualizada
    const updatedBet = await Bet.findOne({
      where: { user_id: testUser.id, bet_type: 'grupo', bet_value: '23' }
    });
    
    // Se a dezena sorteada for 91 (grupo 23), deve ter ganhado
    // Como é aleatório, verificamos que o status mudou de 'pending'
    expect(['won', 'lost']).toContain(updatedBet.status);
  });

  it('✅ 5. Deve listar as apostas do usuário com status atualizado', async () => {
    const res = await request(app)
      .get('/api/history')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    
    const myBet = res.body.find(b => b.bet_type === 'grupo' && b.bet_value === '23');
    expect(myBet).toBeDefined();
    expect(['won', 'lost']).toContain(myBet.status);
  });
});