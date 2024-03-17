import MarkdownIt from 'markdown-it'
import '../custom-styles/style.css'

// Expreimental -> change in the future

export const Markdown = ({ readme }: { readme: string }) => {
    return (
        <pre
            id="readme"
            className="w-full h-[250px] overflow-scroll"
            dangerouslySetInnerHTML={{
                __html: MarkdownIt().render(readme),
            }}
        ></pre>
    )
}
