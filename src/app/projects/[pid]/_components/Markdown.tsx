import MarkdownIt from 'markdown-it'
import '../custom-styles/style.css'

// Expreimental -> change in the future

const Markdown = ({ readme }: { readme: string }) => {
    return (
        <pre
            id="readme"
            className="h-[250px] overflow-scroll"
            dangerouslySetInnerHTML={{
                __html: MarkdownIt().render(readme),
            }}
        ></pre>
    )
}

export default Markdown
