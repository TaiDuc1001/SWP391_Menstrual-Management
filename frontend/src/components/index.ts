/**
 * Centralized component exports to reduce code duplication
 * Import all reusable components from this single entry point
 */


export {Button} from './common/Button';
export {default as Card} from './common/Card';
export {default as LoadingSpinner} from './common/LoadingSpinner';
export {default as SearchInput} from './common/SearchInput';
export {default as StatusBadge} from './common/StatusBadge';
export {default as Pagination} from './common/Pagination/Pagination';
export {default as Checkbox} from './common/Checkbox/Checkbox';


export {default as TypeBadge} from './common/Badge/TypeBadge';
export {default as TagBadge} from './common/Badge/TagBadge';




export {default as TitleBar} from './feature/TitleBar/TitleBar';
export {default as DropdownSelect} from './feature/Filter/DropdownSelect';
export {default as MultiSelectDropdown} from './feature/Filter/MultiSelectDropdown';


export {default as UtilityBar} from './feature/UtilityBar/UtilityBar';


export {default as Header} from './layout/Header/Header';
export {default as AdminHeader} from './layout/Header/AdminHeader';
export {default as PublicHeader} from './layout/Header/PublicHeader';
export {default as Sidebar} from './layout/Sidebar/Sidebar';
export {default as Footer} from './layout/Footer/Footer';
export {default as PublicLayout} from './layout/Layouts/PublicLayout';


// Profile Management
export { default as DoctorProfileGuard } from './DoctorProfileGuard';
export * from './common/ProgressBar';
