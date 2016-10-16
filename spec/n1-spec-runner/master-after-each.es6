import pathwatcher from 'pathwatcher';
import ReactTestUtils from 'react-addons-test-utils';

class MasterAfterEach {
  setup(afterEach) {
    afterEach(() => {
      NylasEnv.packages.deactivatePackages();
      NylasEnv.menu.template = [];

      NylasEnv.themes.removeStylesheet('global-editor-styles');

      if (NylasEnv.state) {
        delete NylasEnv.state.packageStates;
      }

      if (!window.debugContent) {
        document.getElementById('jasmine-content').innerHTML = '';
      }
      ReactTestUtils.unmountAll();

      jasmine.unspy(NylasEnv, 'saveSync');
      this.ensureNoPathSubscriptions();
      return waits(0);
    }); // yield to ui thread to make screen update more frequently
  }

  ensureNoPathSubscriptions() {
    const watchedPaths = pathwatcher.getWatchedPaths();
    pathwatcher.closeAllWatchers();
    if (watchedPaths.length > 0) {
      throw new Error(`Leaking subscriptions for paths: ${watchedPaths.join(", ")}`);
    }
  }
}

export default new MasterAfterEach()