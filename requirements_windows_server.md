https://pyav.org/docs/develop/overview/installation.html

https://github.com/PyAV-Org/PyAV

https://docs.anaconda.com/miniconda/install/#quick-command-line-install

### Instalationsschritte

- Visual Studio installer:
- Microsoft Visual C++ 14.0 or greater is required.
- MSVC Compiler muss heruntergeladen werden -> Visual Studio installer, CMake buildtools, MSVC v143 - VS 2022 C++ x64/x86-Buildtools

- conda installieren:

  - used version 24.11.2
  - curl https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe -o miniconda.exe
  - install via miniconda.exe
  - path Variablen setzen:
    - C:\ProgramData\miniconda3
    - C:\ProgramData\miniconda3\Scripts
    - C:\ProgramData\miniconda3\Library\bin
  - conda install av==11.0.0 -c conda-forge

- Andere Libs installieren:
- pip install opencv-python==4.10.0.84
- pip install opencv-contrib-python==4.10.0.84
- pip install aiohttp==3.9.3
- pip install aiortc==1.7.0

#### Für die Ausarbeitung

- ffmmepg libary hat Probleme gemacht
- Installation Schwierigkeiten auf Windows 10
- conda verwenden um ältere Version von av zu installieren -> alle Sub libaries mit den compatiblen Versionen
- Kamera braucht USB 2.0 -> USB 3.0 hat das Bild komplett zerstört
