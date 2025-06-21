import './MainContent.css';
import MC_First from './MC_First';
import MC_Second from './MC_Second';
import MC_Third from './MC_Third';
function MainContent() {
    const css = {
        backgroundColor: '#FFFFFF',
        gridColumn: '2 / 3',
        display: 'grid',
        gridTemplateColumns: '1fr 930px 1fr',
        gridTemplateRows: 'auto auto auto',

    };
    return (
        <>
            <div style={css}>
                <MC_First />
                <MC_Second />
                <MC_Third />
            </div>
        </>
    );
}
export default MainContent;