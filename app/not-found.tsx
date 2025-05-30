import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Página não encontrada</h2>
      <p className="mt-2 text-muted-foreground">
        Desculpe, não conseguimos encontrar a página que você está procurando.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}
