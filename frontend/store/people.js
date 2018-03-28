
export const state = () => ({
    list: [],
});

export const getters = {
    getList: state => {
        return [...state.list];
    }
};

export const actions = {
    async loadGitHubProfile ({commit}) {}
};

export const mutations = {
};

