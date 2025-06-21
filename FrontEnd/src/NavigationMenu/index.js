import NavMenu from "./NavMenu";
import NavSearch from "./NavSearch";

function NavigationMenu() {

    const css ={
        display: 'flex',
        flexDirection: 'column',
        height: '110px',
    };
    return (
        <>
            <div style={css}>
                <NavMenu />
                <NavSearch />
            </div>
        </>
    );
}
export default NavigationMenu;