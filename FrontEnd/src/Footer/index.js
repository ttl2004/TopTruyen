import './Footer.css';
import logo from '../Assets/logo.png';
function Footer() {
    const css = {
        backgroundColor: '#FB7185',
        width: '100%',
        height: '200px',
        display: 'grid',
        gridTemplateColumns: '1fr 930px 1fr',
        gridTemplateRows: '1fr',
    };
    return (
        <>
            <div style={css}>
                <div className='center-footer'>
                    <div className='footer-text'>
                        <div className="logo-footer">
                            <img src={logo} alt="logo" />
                            <span>TopTruyen</span>
                        </div>
                        <p>
                            Web đọc truyện tranh, truyện chữ online được cập nhập liên tục mỗi ngày. 
                            Kho truyện đa dạng với nhiều thể loại khác nhau, phù hợp cho mọi lứa tuổi. 
                        </p>
                    </div>
                    <div className='contact'>
                        <h3>Liên hệ với Admin:</h3>
                        <div className='contact-info'>
                            <div className='contact-item'>
                                <div className='contact-icon'>
                                    <i className="fa-solid fa-phone"></i>
                                    <span>Phone:</span>
                                </div> 
                                <div className='contact-icon'>
                                    <i className="fa-solid fa-envelope"></i>
                                    <span>Email:</span>
                                </div> 
                                <div className='contact-icon'>
                                    <i className="fa-brands fa-facebook-f"></i>
                                    <span>Facebook:</span>
                                </div> 
                            </div>
                            <div className='contact-item-text'>
                                <span>0901755872</span>
                                <span>longtieutran72@gmail.com</span>
                                <a href="https://www.facebook.com/long.tran.464339/">https://www.facebook.com/long.tran.464339/</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Footer;