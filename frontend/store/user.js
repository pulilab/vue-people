import { gitHubUserProfile } from '~/integrations/github/queries';
import { gitHubGraphQlRequest } from '~/integrations/github/utilities';

export const state = () => ({
    user: undefined,
    gitHubProfile: undefined
});

export const getters = {

};

export const actions = {
    async loadGitHubProfile ({commit}) {
        const gh = gitHubGraphQlRequest();
        const { data } = await this.$axios.post(gh.url, gitHubUserProfile(), gh.options);
        commit('SET_USER_GITHUB_PROFILE', {...data.data.viewer });
    }
};

export const mutations = {
    SET_USER_GITHUB_PROFILE: (state, profile) => {
        state.gitHubProfile = profile;
    }
};

