import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('gcp-cloud-run e2e', () => {
  it('should create gcp-cloud-run', async (done) => {
    const plugin = uniq('gcp-cloud-run');
    ensureNxProject('@nx-extend/gcp-cloud-run', 'dist/packages/gcp-cloud-run');
    await runNxCommandAsync(
      `generate @nx-extend/gcp-cloud-run:gcp-cloud-run ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('gcp-cloud-run');
      ensureNxProject(
        '@nx-extend/gcp-cloud-run',
        'dist/packages/gcp-cloud-run'
      );
      await runNxCommandAsync(
        `generate @nx-extend/gcp-cloud-run:gcp-cloud-run ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('gcp-cloud-run');
      ensureNxProject(
        '@nx-extend/gcp-cloud-run',
        'dist/packages/gcp-cloud-run'
      );
      await runNxCommandAsync(
        `generate @nx-extend/gcp-cloud-run:gcp-cloud-run ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
