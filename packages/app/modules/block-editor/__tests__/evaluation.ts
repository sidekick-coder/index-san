import { vi } from 'vitest'
import * as Evaluation from '@modules/evaluation/composables/use-evaluation'

function createRuntimeMock() {
    const callbacks = {
        stdout: [] as Function[],
        stderr: [] as Function[],
    }

    return {
        run: vi.fn(),
        onDone: vi.fn().mockResolvedValue(undefined),
        on: (event: keyof typeof callbacks, callback: any) => callbacks[event]?.push(callback),
        emit: (event: keyof typeof callbacks, ...args: any[]) => {
            callbacks[event].forEach((cb) => cb(...args))
        },
    }
}

export function useEvaluationMock() {
    const useEvaluation = vi.fn()
    const useEvaluationRun = vi.fn()

    const runtime = createRuntimeMock()

    useEvaluation.mockReturnValue({
        run: useEvaluationRun,
    })

    useEvaluationRun.mockReturnValue(runtime as any)

    vi.spyOn(Evaluation, 'useEvaluation').mockImplementation(() => useEvaluation())

    return { useEvaluation, useEvaluationRun, runtime }
}
