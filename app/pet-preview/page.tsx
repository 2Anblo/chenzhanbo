import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cat companion preview',
  robots: { index: false, follow: false },
};

export default function PetPreviewPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-6 py-32">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">A little company</p>
      <h1 className="font-serif text-5xl">一只陪你读书的小猫</h1>
      <p className="mt-6 leading-8 text-muted-foreground">
        奶油色的金三花，喜欢趴着，也偶尔散散步。点击左下角的小猫摸摸它，拖动可以搬家；收起后，点击爪印就能再见到它。
      </p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        A quiet companion. Pet the cat, drag it to a cozy spot, or use the paw button to bring it back.
      </p>
    </main>
  );
}
