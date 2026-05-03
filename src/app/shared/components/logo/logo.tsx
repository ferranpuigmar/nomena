import { NavLink } from 'react-router-dom'
import LogoIcon from '@src/assets/icons/imagotipo.svg?react';
import { ROUTES } from '@src/app/router';

const Logo = () => {
    return (
        <NavLink to={ROUTES.home.path} className="text-3xl font-bold text-accent-primary flex items-center">
            <LogoIcon className="text-accent-primary size-8" />
            <span className="ml-3 font-heading text-accent-primary">nomena</span>
        </NavLink>
    )
}

export default Logo