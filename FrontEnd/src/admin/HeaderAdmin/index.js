import './HeaderAdmin.css';
import logo from '../../Assets/logo.png';
function HeaderAdmin() {
    return (
        <>
            <div className="headerAdmin">
                <header>
                    <div className="logo">
                        <img src={logo} alt="logo" />
                        <span>TopTruyen</span>
                    </div>
                </header>
            </div>
        </>
    );
}

export default HeaderAdmin;