Куда класть 3D-файлы флакона:

1) Положи модели в эту папку: assets/models/
2) Для компьютера: perfume.glb
3) Для телефона: perfume-mobile-opt.glb

Итоговые пути:
- assets/models/perfume.glb
- assets/models/perfume-mobile-opt.glb

Поддерживаемый формат:
- Рекомендуется: .glb
- Также можно: .gltf (но тогда нужны отдельные текстуры)

Если хочешь другие имена:
- Открой index.html
- Найди id="perfumeModel"
- Измени:
  - data-desktop-src="assets/models/perfume.glb"
  - data-mobile-src="assets/models/perfume-mobile-opt.glb"
