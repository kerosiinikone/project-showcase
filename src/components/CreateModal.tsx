'use client'

import { Stage } from '@/models/Project/types'
import { UserRepo } from '@/services/github'
import { PlusIcon, X } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import TagLabel from './TagItem'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from './ui/form'

type ModalContentParams = {
    repos: UserRepo[] | null
    dispatch: any
    title: string
    subTitle: string
    action: string
    initialTags?: string[]
    actionLoading: boolean
    setActionLoading: Dispatch<SetStateAction<boolean>>
}

const ProjectSchema = z.object({
    name: z
        .string()
        .min(5, 'Name Too Short')
        .max(50, 'Name Too Long'),
    website: z.string().max(80).optional(),
    stage: z.nativeEnum(Stage),
    github_url: z.string().max(2000).optional(),
    description: z.string().optional(),
    tags: z.array(z.string().max(15)).max(3).optional(),
})

export default function CreateModalLayout({
    dispatch,
    repos,
    action,
    title,
    subTitle,
    setActionLoading,
    actionLoading,
    initialTags,
}: ModalContentParams) {
    const [tags, setTags] = useState<string[]>(initialTags ?? [])
    const form = useForm<z.infer<typeof ProjectSchema>>({
        resolver: zodResolver(ProjectSchema),
    })

    return (
        <DialogContent
            className="flex flex-col justify-center items-center h-max bg-white border-2 border-slate-200 
                rounded-lg shadow-xl"
        >
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription id="modal-description">
                    {subTitle}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    action={dispatch}
                    onSubmit={() => {
                        setActionLoading(true)
                    }}
                    className="flex flex-col justify-between p-6 h-max"
                >
                    <input
                        hidden
                        readOnly
                        name="tags"
                        value={`[${tags.map((t) => {
                            return `"${t}"`
                        })}]`}
                    />
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                data-testid="name-input"
                                                placeholder="Name"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                data-testid="description-input"
                                                placeholder="Description"
                                                {...field}
                                                defaultValue=""
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 mb-4 grid-cols-2 grid-rows-1">
                        <div className="row-span-2">
                            <Controller
                                control={form.control}
                                data-testid="stage"
                                name="stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stage</FormLabel>
                                        <Select {...field}>
                                            <FormControl>
                                                <SelectTrigger
                                                    id="stage"
                                                    name="stage"
                                                >
                                                    <SelectValue placeholder="Stage" />
                                                    <SelectContent>
                                                        <SelectItem
                                                            key={
                                                                Stage.IDEA
                                                            }
                                                            value={
                                                                Stage.IDEA
                                                            }
                                                        >
                                                            Idea
                                                        </SelectItem>
                                                        <SelectItem
                                                            key={
                                                                Stage.PLAN
                                                            }
                                                            value={
                                                                Stage.PLAN
                                                            }
                                                        >
                                                            Plan
                                                        </SelectItem>
                                                        <SelectItem
                                                            key={
                                                                Stage.DEVELOPMENT
                                                            }
                                                            value={
                                                                Stage.DEVELOPMENT
                                                            }
                                                        >
                                                            In
                                                            development
                                                        </SelectItem>
                                                        <SelectItem
                                                            key={
                                                                Stage.FINISHED
                                                            }
                                                            value={
                                                                Stage.FINISHED
                                                            }
                                                        >
                                                            Finished
                                                        </SelectItem>
                                                        <SelectItem
                                                            key={
                                                                Stage.PRODUCTION
                                                            }
                                                            value={
                                                                Stage.PRODUCTION
                                                            }
                                                        >
                                                            In
                                                            production
                                                        </SelectItem>
                                                    </SelectContent>
                                                </SelectTrigger>
                                            </FormControl>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="row-span-2">
                            <Controller
                                control={form.control}
                                name="github_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Repo</FormLabel>
                                        <Select {...field}>
                                            <FormControl>
                                                <SelectTrigger
                                                    id="github_url"
                                                    name="github_url"
                                                >
                                                    <SelectValue placeholder="None" />
                                                    <SelectContent>
                                                        <SelectItem
                                                            defaultChecked
                                                            disabled
                                                            value="null"
                                                        />
                                                        {repos?.map(
                                                            (
                                                                repo
                                                            ) => {
                                                                return (
                                                                    <SelectItem
                                                                        value={
                                                                            repo.github_url
                                                                        }
                                                                    >
                                                                        {
                                                                            repo.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            }
                                                        )}
                                                    </SelectContent>
                                                </SelectTrigger>
                                            </FormControl>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="row-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Tags
                            </label>
                            <Input
                                onKeyDown={(
                                    e: React.KeyboardEvent<HTMLInputElement> & {
                                        target: {
                                            value: string
                                        }
                                    }
                                ) => {
                                    if (e.code === 'Enter') {
                                        e.preventDefault()
                                        if (
                                            tags.indexOf(
                                                e.target.value
                                            ) === -1 &&
                                            tags.length < 3 // Global limit somewhere ??
                                        ) {
                                            setTags((state) => {
                                                return [
                                                    ...state,
                                                    e.target.value,
                                                ]
                                            })
                                            setTimeout(() => {
                                                e.target.value = ''
                                            }, 100)
                                        }
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                    rounded-lg py-2 px-3 w-full"
                                placeholder="Give your project tags"
                            />
                        </div>

                        <div className="row-span-2">
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Website"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 mb-4 grid-cols-1">
                        <div className="flex flex-row gap-2">
                            {tags.map((t) => {
                                return (
                                    <TagLabel
                                        key={t}
                                        name={t}
                                        remove={() => {
                                            setTags((state) => {
                                                return state.filter(
                                                    (tag) => {
                                                        return (
                                                            tag !== t
                                                        )
                                                    }
                                                )
                                            })
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex w-full h-full items-end">
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <DialogClose
                                    asChild
                                    type="submit"
                                    className="w-64 cursor-pointer inline-flex py-5 px-7 text-sm font-medium 
                                        justify-center items-center"
                                >
                                    <Button
                                        type="submit"
                                        disabled={actionLoading}
                                        id="submit-project"
                                        data-testid="submit-project-button"
                                    >
                                        <PlusIcon
                                            className="w-5 h-5 me-2"
                                            stroke="white"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            aria-hidden="true"
                                            fill="none"
                                            viewBox="0 0 22 24"
                                        />
                                        {!actionLoading // Spinner maybe?
                                            ? action
                                            : 'Loading'}
                                    </Button>
                                </DialogClose>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </DialogContent>
    )
}
