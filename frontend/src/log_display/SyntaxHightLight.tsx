import "../assets/prism/prism.css"

export function SyntaxHighlight({children, language}: any) {
    return (
        <pre>
            <code className={`language-${language}`}>{children}</code>
        </pre>
    );
}