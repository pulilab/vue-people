import { state } from '../../store/index';

test('store state is unique between calls', () => {
    const s = state();
    expect(s).not.toBe(state());
    expect(s).toEqual(state());
});
