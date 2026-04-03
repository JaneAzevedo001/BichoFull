import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { useState } from "react";

// ✅ Função segura para formatar datas (adicione no topo do arquivo)
const formatDate = (
  value: string | number | Date | null | undefined,
): string => {
  if (!value) return "—";

  // Tenta criar a data
  const date = new Date(value);

  // Verifica se é válida
  if (isNaN(date.getTime())) {
    console.warn("⚠️ Data inválida:", value);
    return "—";
  }

  // Formata para pt-BR
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface Bet {
  id: number;
  bet_type: string;
  bet_value: string;
  amount: number;
  potential_prize: number;
  status: string;
  created_at: string;
  animalName?: string;
}

export default function BetsTable({ bets }: { bets: Bet[] }) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const safeBets = Array.isArray(bets) ? bets : [];
  const paginated = safeBets.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Data e Hora</TableCell>
              <TableCell isHeader>Aposta</TableCell>
              <TableCell isHeader>Animal Associado</TableCell>
              <TableCell isHeader>Valor</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Retorno</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((bet) => (
              <TableRow key={bet.id}>
                <TableCell>{formatDate(bet.created_at)}</TableCell>
                <TableCell>{`${bet.bet_type} - ${bet.bet_value}`}</TableCell>
                <TableCell>{bet.animalName || "—"}</TableCell>
                <TableCell>R$ {(Number(bet.amount) || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    size="sm"
                    color={
                      bet.status === "won"
                        ? "success"
                        : bet.status === "lost"
                          ? "error"
                          : "warning"
                    }
                  >
                    {bet.status === "won"
                      ? "Ganhou"
                      : bet.status === "lost"
                        ? "Perdeu"
                        : "Pendente"}
                  </Badge>
                </TableCell>
                {/* ✅ potential_prize TAMBÉM com conversão segura */}
                <TableCell>
                  R$ {(Number(bet.potential_prize) || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center p-4">
        <Button
          size="sm"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </Button>
        <span>Página {page + 1}</span>
        <Button
          size="sm"
          disabled={(page + 1) * pageSize >= safeBets.length}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
