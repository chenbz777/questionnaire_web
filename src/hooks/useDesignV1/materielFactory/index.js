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

// 定义工厂类，负责根据类型创建物料
class MaterielFactory {
  // 工厂方法，根据传入的类型决定创建哪种物料
  static createMateriel(type, instance) {
    if (modules[type]) {
      return new modules[type](instance);
    }

    return;
  }

  static getModules() {
    return modules;
  }
}

export default MaterielFactory;