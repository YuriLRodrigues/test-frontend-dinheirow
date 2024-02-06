import { CharacterEntity } from '../../enterprise/characters.entity'

export type FindAllCharactersProps = {
  limit: string
  page: string
  hash: string
  ts: number
  search?: string
}
export type FindCharacterByIdProps = {
  id: string
}

export interface CharactersRepository {
  findAll({ hash, limit, page, ts, search }: FindAllCharactersProps): Promise<CharacterEntity>
  findById({ id }: FindCharacterByIdProps): Promise<CharacterEntity>
}