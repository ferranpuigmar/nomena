interface FavoriteToastContentProps {
  action: 'add' | 'remove';
  state: 'loading' | 'success';
  favoriteName: string;
}

const toastContentConfig = {
  remove: {
    loading: 'Eliminando',
    success: 'Eliminado',
    relation: 'de',
  },
  add: {
    loading: 'Anadiendo',
    success: 'Anadido',
    relation: 'a',
  },
};

export const FavoriteToastContent = ({ action, state, favoriteName }: FavoriteToastContentProps) => {
  const actionLabel = toastContentConfig[action][state];
  const relation = toastContentConfig[action].relation;

  return (
    <span>
      {actionLabel} <strong>{favoriteName}</strong> {relation} favoritos
    </span>
  );
};

