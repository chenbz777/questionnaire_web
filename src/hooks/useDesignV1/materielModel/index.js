// 同步导入所有模块
const importModules = import.meta.glob('./*.js', { eager: true });

// 模块集合
const modules = {};

for (const path in importModules) {
  const module = importModules[path];

  const moduleName = path.split('/').pop().replace('.js', '');

  if (moduleName === 'BaseMateriel') {
    continue;
  }

  modules[moduleName] = module.default;
}

delete modules.Materiel;

export default modules;