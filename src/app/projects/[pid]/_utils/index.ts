// https://stackoverflow.com/a/9461657

import { ProjectWithUser } from '@/models/Project/types'
import { getReadmeFile } from '@/services/trpc/server'

export const kFormatter = (num: number) => {
    return Math.abs(num) > 999
        ? (Math.sign(num) * Math.round(Math.abs(num) / 100)) / 10 +
              'k'
        : Math.sign(num) * Math.abs(num)
}

export const b64DecodeUnicode = (str: string) => {
    return decodeURIComponent(
        Array.prototype.map
            .call(atob(str), function (c) {
                return (
                    '%' +
                    ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                )
            })
            .join('')
    )
}

export const getReadmeContents = async (project: ProjectWithUser) => {
    if (project.github_url) {
        const splitUrl = project.github_url.split('/')
        try {
            const contents = await getReadmeFile({
                repo: splitUrl[splitUrl.length - 1],
                user: project.author.name!,
            })

            if (contents.trim() !== '') {
                return b64DecodeUnicode(contents)
            }
        } catch (error) {
            return null
        }
    }
}
