import React, { useRef, useState } from 'react';

function SignaturePad(props) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";

        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const finishDrawing = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
        saveSignature();
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // const signatureData = canvas.toDataURL("image/png");
        // console.log(signatureData); 
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        const signatureData = canvas.toDataURL("image/png");
        if (props.onSave) {
            props.onSave(signatureData);
        }
        // console.log(signatureData); 
    };

    return (
        <div>
            <canvas 
                ref={canvasRef} 
                width="500" 
                height="200" 
                style={{ border:'1px solid #ddd' }}
                onMouseDown={startDrawing} 
                onMouseMove={draw} 
                onMouseUp={finishDrawing} 
                onMouseLeave={finishDrawing}
            />
            <button onClick={clearSignature} type="button" style={{display:'block'}} >서명 지우기</button>
        </div>
    );
}

export default SignaturePad;
