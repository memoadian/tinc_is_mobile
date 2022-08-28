import UserSearchRemoteDataSource from "../../../../../data/UserSearch/UserSearchRemoteDataSource";
import GetUserSearchUseCase from "../../../../../domain/UserSearch/useCase/GetUserSearchUseCase";
import { UserSearchBloc } from "../UserSearchBloc";

function provideUserSearchBloc(): UserSearchBloc {
    const repository = new UserSearchRemoteDataSource();
    const getUserSearchUseCase = new GetUserSearchUseCase(repository)
    return new UserSearchBloc(getUserSearchUseCase);
}

export const userSearchModule = {
    provideUserSearchBloc
}