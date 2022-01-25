// import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
// import { Tree, readProjectConfiguration } from '@nrwl/devkit'
// import { generateNewApp as generateStrapi } from '@strapi/generate-new'
//
// import generator from './generator'
// import { StrapiGeneratorSchema } from './schema'
//
// jest.mock('@strapi/generate-new')
//
// describe('strapi generator', () => {
//
//   let appTree: Tree
//   const options: StrapiGeneratorSchema = { name: 'test' }
//
//   beforeEach(() => {
//     appTree = createTreeWithEmptyWorkspace()
//   })
//
//   it('should run successfully', async () => {
//     await generator(appTree, options)
//     const config = readProjectConfiguration(appTree, 'test')
//
//     expect(config).toBeDefined()
//     expect(generateStrapi).toHaveBeenLastCalledWith(
//       'apps/test',
//       {
//         'quickstart': true,
//         'run': false
//       }
//     )
//   })
//
// })
