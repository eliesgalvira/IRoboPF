{
  description = "Entorno de reproducción de citas IRoboPF (Linux x86_64)";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/4c7870105e7f1fdf9c48688c8d7efc21abf0688a";
  outputs = { self, nixpkgs }: let
    pkgs = import nixpkgs { system = "x86_64-linux"; };
  in {
    devShells.x86_64-linux.default = pkgs.mkShell {
      packages = [ pkgs.python313 pkgs.uv pkgs.poppler-utils ];
      LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
      UV_PYTHON_DOWNLOADS = "never";
    };
  };
}
