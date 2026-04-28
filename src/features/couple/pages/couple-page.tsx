import { useState } from 'react';
import { useAuthStore } from '@src/features/auth/store/auth-store';
import { useCouple } from '../hooks/use-couple';

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
    return <p>Cargando...</p>;
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Compartir favoritos</h1>
        <p className="mt-2 text-gray-600">
          Conecta con tu pareja para ver sus nombres favoritos.
        </p>
      </div>

      {/* Partners list */}
      {hasPartners && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Conectado con
          </h2>
          {sharedFavorites.map((partnerFavorites) => (
            <div
              key={partnerFavorites.userId}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
            >
              <span className="text-sm font-medium text-gray-800">
                {partnerDisplayNames[partnerFavorites.userId] ?? partnerFavorites.userId}
              </span>
              <button
                onClick={() => removePartner(partnerFavorites.userId)}
                disabled={isRemoving}
                className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                Desconectar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Generate invite */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Invitar a alguien
        </h2>
        <button
          onClick={() => generateInvite()}
          disabled={isGenerating}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {isGenerating ? 'Generando...' : 'Generar código de invitación'}
        </button>

        {generatedCode && (
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <code className="flex-1 break-all text-sm text-gray-800">{generatedCode}</code>
            <button
              onClick={handleCopy}
              className="shrink-0 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        )}

        {generatedCode && (
          <p className="text-xs text-gray-400">
            Este código expira en 48 horas. Generar uno nuevo invalidará el anterior.
          </p>
        )}
      </div>

      {/* Redeem invite */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Introducir código de invitación
        </h2>
        <form onSubmit={handleRedeem} className="flex gap-3">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Pega el código aquí"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isRedeeming || !codeInput.trim()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isRedeeming ? 'Verificando...' : 'Conectar'}
          </button>
        </form>

        {redeemError && (
          <p className="text-sm text-red-500">
            {redeemError instanceof Error ? redeemError.message : 'Error al canjear el código.'}
          </p>
        )}
      </div>
    </section>
  );
}
