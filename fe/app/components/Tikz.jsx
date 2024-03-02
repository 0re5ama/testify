import { useEffect } from 'react';

const Tikz = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://tikzjax.com/v1/tikzjax.js';
        script.async = true;

        script.onload = () => {
            setTimeout(() => {
                window.MathJax.typeset();
            }, 100);
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            <link
                rel="stylesheet"
                type="text/css"
                href="https://tikzjax.com/v1/fonts.css"
            />
            <div id="tikzContainer" style={{ width: '100%', height: '100%' }}>
                <script type="text/tikz">
                    {`
            \\begin{tikzpicture}
              \\draw (0,0) circle (1in);
            \\end{tikzpicture}
          `}
                </script>
            </div>
        </div>
    );
};

export default Tikz;
