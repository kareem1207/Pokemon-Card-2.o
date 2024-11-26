export const Footer = ()=>{
    const footerStyle = {
        backgroundColor: localStorage.getItem("background-color"),
        color: localStorage.getItem("text-color"),
        padding: '20px',
        textAlign: 'left'
    };
    return<>
    <h1 style={footerStyle}>
        Created By Kareem
        </h1>
    </>
}