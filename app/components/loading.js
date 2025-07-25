export function Loading() {

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        padding: '2rem',
        gap: '1.5rem'
    }

    const spinnerStyle = {
        width: '50px',
        height: '50px',
        border: '4px solid #e0e0e0',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    }

    const textStyle = {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#666666',
        margin: '0',
        textAlign: 'center'
    }

    const keyframesStyle = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `

    return (
        <>
            <style>{keyframesStyle}</style>
            <div style={containerStyle}>
                <div style={spinnerStyle}></div>
                <h3 style={textStyle}>Carregando...</h3>
            </div>
        </>
    )

}