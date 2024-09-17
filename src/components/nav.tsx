import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

// Function to clear all cookies
function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}

// Handle logout and redirect to login
function handleLogout() {
  deleteAllCookies();
  window.location.href = "/login"; // Redirect to the login page
}

export function Nav() {
  return (
    <NavigationMenu className="p-2 font-mono ">
      <NavigationMenuList className="gap-10">
        <NavigationMenuItem>
          <NavigationMenuLink>
            <h1 className="text-2xl font-bold">
              Neura<sup className="text-xs text-teal-400">Beta</sup>
            </h1>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <a href="/">Home</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <Button variant="destructive" onClick={handleLogout}>Log-Out</Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
