import { upperFirst, camelCase, uniq } from 'lodash';

export default ({ app }) => {
    const files = import.meta.globEager('../components/*.vue');

    Object.entries(files).forEach(([filename, component]) => {
        const name =upperFirst(camelCase(filename.split('/').pop().replace('.vue', '')));

        app.component(name, component.default || component);
    });
}