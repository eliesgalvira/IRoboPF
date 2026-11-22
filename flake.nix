{
  description = "Entorno de desarrollo de IRoboPF";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      sistemas = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      porSistema = f: nixpkgs.lib.genAttrs sistemas (sistema: f nixpkgs.legacyPackages.${sistema});
    in
    {
      devShells = porSistema (pkgs: {
        default = pkgs.mkShellNoCC {
          packages = [
            pkgs.bun
            pkgs.nodejs_24
          ];
        };
      });
    };
}
