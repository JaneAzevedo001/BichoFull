import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Button from "../ui/button/Button";
import { useState } from "react";

interface Draw {
  id: number;
  draw_datetime: string;
  results: { drawn_thousand: string }[];
}

interface Animal {
  animal_name: string;
  dezenas: string[];
}

export default function DrawsTable({
  draws,
  animals,
}: {
  draws: Draw[];
  animals: Animal[];
}) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const paginated = Array.isArray(draws)
    ? draws.slice(page * pageSize, (page + 1) * pageSize)
    : [];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Data e Hora</TableCell>
              <TableCell isHeader>Resultados</TableCell>
              <TableCell isHeader>Animal Sorteado</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((draw) => {
              const dezena = draw.results[0]?.drawn_thousand?.slice(-2);
              const found = animals.find((a) => a.dezenas.includes(dezena));
              const animalName = found?.animal_name || "—";

              return (
                <TableRow key={draw.id}>
                  <TableCell>{new Date(draw.draw_datetime).toLocaleString()}</TableCell>
                  <TableCell>{draw.results.map((r) => r.drawn_thousand).join(", ")}</TableCell>
                  <TableCell>{animalName}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center p-4">
        <Button size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </Button>
        <span>Página {page + 1}</span>
        <Button
          size="sm"
          disabled={(page + 1) * pageSize >= draws.length}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
