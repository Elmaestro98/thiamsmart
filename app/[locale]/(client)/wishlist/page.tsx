import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import { currentUser } from "@clerk/nextjs/server";

const WishListPage = async () => {
  const user = await currentUser();
  return (
    <>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Veuillez se connercter ou créer un compte pour voir vos produis en favoris !" />
      )}
    </>
  );
};

export default WishListPage;
