import { useState } from 'react';
import { useAuthStore } from '@src/features/auth/store/auth-store';
import { useCouple } from '../hooks/use-couple';
import { HeartHandshake, Loader2, Share2, Link, Copy, Timer } from 'lucide-react';

export function CouplePage() {
  const userId = useAuthStore((state) => state.user?.uid);
  const {
    sharedFavorites,
    partnerDisplayNames,
    generatedCode,
    isLoadingShared,
    generateInvite,
    isGenerating,
    redeemInvite,
    isRedeeming,
    redeemError,
    removePartner,
    isRemoving,
  } = useCouple(userId);

  const [codeInput, setCodeInput] = useState('');
  const [copied, setCopied] = useState(false);

  const hasPartners = sharedFavorites.length > 0;

  const handleCopy = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = codeInput.trim();
    if (!trimmed) return;
    redeemInvite(trimmed, {
      onSuccess: () => setCodeInput(''),
    });
  };

  if (isLoadingShared) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-accent-primary" />
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-3">
        <HeartHandshake size={48} strokeWidth={1.5} className="text-accent-primary" />
        <h1 className="text-2xl md:text-[32px] font-heading font-semibold text-neutral-900 leading-tight">
          Compara con tu pareja
        </h1>
        <p className="text-sm md:text-[15px] text-neutral-600 max-w-[300px] md:max-w-[480px]">
          Conecta tu cuenta con la de tu pareja para descubrir qué nombres os gustan a los dos
        </p>
      </div>

      {/* Connected Partners Section */}
      {hasPartners && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-7 space-y-5">
            <h2 className="text-lg font-heading font-semibold text-neutral-900">
              Conectado con
            </h2>
            <div className="space-y-3">
              {sharedFavorites.map((partnerFavorites) => (
                <div
                  key={partnerFavorites.userId}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-medium text-neutral-900">
                    {partnerDisplayNames[partnerFavorites.userId] ?? partnerFavorites.userId}
                  </span>
                  <button
                    onClick={() => removePartner(partnerFavorites.userId)}
                    disabled={isRemoving}
                    className="text-sm text-accent-secondary hover:text-accent-secondary/80 disabled:opacity-50 transition"
                  >
                    Desconectar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Generate Invite Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-7 space-y-5">
          {/* Header with icon */}
          <div className="flex items-center gap-3">
            <Share2 size={20} className="text-accent-primary" />
            <h2 className="text-lg font-heading font-semibold text-neutral-900">
              Invitar a tu pareja
            </h2>
          </div>
          
          <p className="text-sm text-neutral-600">
            Genera un código único y compártelo con tu pareja para conectar vuestras cuentas.
          </p>

          {/* Code Box */}
          {generatedCode ? (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-5 py-4 flex items-center justify-between gap-3">
              <code className="flex-1 text-sm md:text-lg font-bold tracking-[2px] text-neutral-900 break-all">
                {generatedCode}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 text-neutral-500 hover:text-accent-primary transition"
                aria-label={copied ? 'Copiado' : 'Copiar código'}
              >
                <Copy size={18} />
              </button>
            </div>
          ) : (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-5 py-4 flex items-center justify-center h-[58px]">
              <span className="text-sm text-neutral-400">
                Genera un código para compartir
              </span>
            </div>
          )}

          {/* Expiration info */}
          {generatedCode && (
            <div className="flex items-center gap-2.5">
              <Timer size={14} className="text-neutral-500" />
              <p className="text-xs text-neutral-500">
                Este código expira en 48 horas
              </p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={() => generateInvite()}
            disabled={isGenerating}
            className="w-full bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-50 text-white font-medium rounded-lg h-12 transition flex items-center justify-center"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Generando...</span>
              </div>
            ) : (
              'Generar nuevo código'
            )}
          </button>
        </div>

        {/* Redeem Invite Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-7 space-y-5">
          {/* Header with icon */}
          <div className="flex items-center gap-3">
            <Link size={20} className="text-accent-primary" />
            <h2 className="text-lg font-heading font-semibold text-neutral-900">
              ¿Tienes un código?
            </h2>
          </div>
          
          <p className="text-sm text-neutral-600">
            Introduce el código que te ha compartido tu pareja para conectar vuestras cuentas.
          </p>

          <form onSubmit={handleRedeem} className="space-y-5">
            {/* Input */}
            <div className="space-y-2.5">
              <label htmlFor="invite-code" className="block text-sm font-medium text-neutral-600">
                Código de invitación
              </label>
              <input
                id="invite-code"
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Ej: NOM-XXXX-XXXX"
                className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-lg text-sm placeholder:text-neutral-400 focus:outline-none focus:border-accent-primary transition"
              />
            </div>

            {/* Connect Button */}
            <button
              type="submit"
              disabled={isRedeeming || !codeInput.trim()}
              className="w-full bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-50 text-white font-medium rounded-lg h-12 transition flex items-center justify-center"
            >
              {isRedeeming ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Conectando...</span>
                </div>
              ) : (
                'Conectar cuentas'
              )}
            </button>
          </form>

          {redeemError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">
                {redeemError instanceof Error ? redeemError.message : 'Error al canjear el código.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
