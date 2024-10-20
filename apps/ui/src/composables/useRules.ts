export interface Rule {
    (value: any): string | boolean
}

const rules = {
    required(): Rule {
        return (value: any) => {
            return !!value || 'Field required' 
        }
    },
}

export const $rules = rules
