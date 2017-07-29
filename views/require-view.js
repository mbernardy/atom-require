'use babel';
const addRequire = require('../lib/add-require'),
    projectPath = atom.project.getPaths(),
    loadDependencies = require('../lib/load-dependencies'),
    dependencyFactory = require('../models/dependency-factory');

import { SelectListView } from 'atom-space-pen-views';

class RequireView extends SelectListView {
  initialize(...args) {
    super.initialize(...args);
    // Register action for the require command.
    atom.workspaceView.command('require:require', (function(_this) {

        return function () {
            // If this view already has a parent, don't do anything.
            if(_this.hasParent()) return;

            // Add the view to the workspace, then populate the list of
            // items from the last setItems call, then set the focus to
            // the filter editor.
            atom.workspaceView.append(_this);
            _this.setItems(loadDependencies(projectPath));
            _this.populateList();
            _this.focusFilterEditor();
        };

    })(this));

    // Push to the top of the editor. We're probably going to need to let the user
    // refresh their dependencies somehow...
    this.addClass('overlay from-top');
    this.setItems(loadDependencies(projectPath));

    // Populate the list of items from the set items.
    this.populateList();

    // Append to the workspace and then focus it.
    atom.workspaceView.append(this);

    return this.focusFilterEditor();
  }

  /**
   * Generate a view for a module.
   */
  viewForItem(pkg) {
    var icon = pkg.type === dependencyFactory.PROJECT ? 'icon-file-text' : 'icon-file-submodule',
        check = pkg.isRequired ? '<span class="status-renamed"> ✓ </span>' : '';
    return '<li><div class="pull-right secondary-line">' + pkg.version + '</div><div class="primary-line icon ' + icon + '">' + check + pkg.dispName + '</div></li>';
  }

  /**
   * Hook for when the SelectListView registers the user having selected an option
   */
  confirmed(pkg) {
      addRequire(pkg);
      this.cancel();
  };

  getFilterKey() {
    return 'module';
  }

}





module.exports = RequireView;
