import Image from 'next/image'
import Link from 'next/link'
import { Fragment, Suspense } from 'react'

import { FadeIn, FadeInStagger } from '@/components/fade-in'
import { Paginations } from '@/components/paginations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { CharactersProps } from '@/@types/characters'
import { QueryParams } from '@/lib/utils'
import { execute } from '@/utils/execute'

export type ListCharactersProps = {
  searchParams: {
    search: string
    page?: string
  }
}

export const ListCharacters = async ({ searchParams: { page, search } }: ListCharactersProps) => {
  const url = QueryParams.baseUrl('/characters')
    .query({
      query: 'limit',
      value: '9',
    })
    .query({
      query: 'offset',
      value: page,
    })
    .query({
      query: 'nameStartsWith',
      value: search,
    })
    .value()

  const characters = await execute<CharactersProps>(url)

  return (
    <Fragment>
      <FadeInStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {characters?.data.results.map((character) => {
          const imageNotFound = character.thumbnail.path.includes('image_not_available')
          const urlImage = `${character.thumbnail.path}.${character.thumbnail.extension}`
          return (
            <FadeIn key={character.id}>
              <Card className="overflow-hidden">
                <CardContent className="relative h-72 w-full p-0">
                  <Image
                    src={!imageNotFound ? urlImage : '/default-image.jpeg'}
                    alt="Placeholder"
                    fill
                    className="rounded-t-md object-cover object-center"
                  />
                </CardContent>
                <CardHeader>
                  <CardTitle>{character.name}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {character.description || 'Descrição não disponível para este personagem'}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/characters/${character.id}`}>Saiba mais</Link>
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          )
        })}
      </FadeInStagger>
      <Suspense>
        <Paginations total={characters?.data.total} limit={9} />
      </Suspense>
    </Fragment>
  )
}

export const ListCharactersSkeleton = () => {
  const reapeat = Array.from({ length: 9 }, (_, i) => i + 1)
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {reapeat.map((i) => (
        <div key={i} className="rounded-md border bg-card">
          <Skeleton className="relative h-72 w-full rounded-b-none" />
          <div className="flex flex-col space-y-1.5 p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="p-6 pt-0">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
