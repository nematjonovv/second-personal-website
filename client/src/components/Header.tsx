import NavMenu from "../features/menu/components/Menu";
import Logo from "./Logo";
import Container from "./Container";

function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b-2 border-ink
                 bg-paper/70 backdrop-blur-md backdrop-saturate-150"
    >
      <Container>
        <div className="flex items-center justify-between py-4">
          <Logo />
          <NavMenu />
        </div>
      </Container>
    </header>
  );
}

export default Header;