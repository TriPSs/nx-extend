import { uploadExecutor } from '../upload.impl'

jest.mock('@nx-extend/core', () => {
  const originalModule = jest.requireActual('@nx-extend/core')

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    execCommand: jest.fn(() => ({ success: true }))
  }
})

import { execCommand as execCommandMock } from '@nx-extend/core'
import { workspaceRoot } from 'nx/src/utils/workspace-root'

describe('Upload', () => {
  it('should fail when directories is invalid', () => {
    uploadExecutor(
      { bucket: 'test-bucket', directories: ['dist/apps/test-app'], gzip: false },
      { root: 'test-root' } as never
    )

    expect(execCommandMock).not.toHaveBeenCalled()
  })

  it('should upload with directories', () => {
    uploadExecutor(
      { bucket: 'test-bucket', directories: ['dist/apps/test-app:/test-app'], gzip: false },
      { root: 'test-root' } as never
    )

    expect(execCommandMock).toHaveBeenCalled()
    expect(execCommandMock).toHaveBeenCalledWith(
      `gsutil rsync -R ${workspaceRoot}/test-root/dist/apps/test-app gs://test-bucket/test-app`)
  })
})
