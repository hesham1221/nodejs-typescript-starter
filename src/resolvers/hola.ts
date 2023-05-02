import { Query, Resolver } from "type-graphql";

@Resolver()
export class HolaResolver {
  @Query(() => String)
  hola() {
    return "Hola mundo";
  }
}
