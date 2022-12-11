import "../assets/prism/prism.css";
import {SyntaxHighlightProps} from "../Props";

export function SyntaxHighlight(props: SyntaxHighlightProps) {
    return (
        <pre>
            <code className={`language-${props.lang}`}>{props.code}</code>
        </pre>
    );
}