"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Address } from "@/sanity.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (address: Address) => void;
}

// FIX : "default" est un mot réservé JavaScript ; on utilise "isDefault" comme clé d'état.
type FormState = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
};

const INITIAL_FORM: FormState = {
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  isDefault: false,
};

const AddAddressModal = ({ open, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // FIX : on mappe isDefault → default pour l'API qui attend ce champ
        body: JSON.stringify({ ...form, default: form.isDefault }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'ajout");
        return;
      }

      toast.success("Adresse ajoutée avec succès !");
      onSuccess(data.address);
      onClose();
      setForm(INITIAL_FORM);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une adresse de livraison</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {(
            [
              {
                label: "Nom complet",
                name: "name",
                placeholder: "Cheikh Samba",
              },
              {
                label: "Adresse",
                name: "address",
                placeholder: "Saint-Louis Sanar",
              },
              { label: "Ville", name: "city", placeholder: "Paris" },
              { label: "Région / État", name: "state", placeholder: "Dakar" },
              { label: "Code Postal", name: "zip", placeholder: "17000" },
            ] as const
          ).map(({ label, name, placeholder }) => (
            <div key={name} className="grid gap-1.5">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              className="w-4 h-4 cursor-pointer"
            />
            <Label htmlFor="isDefault" className="cursor-pointer">
              Définir comme adresse par défaut
            </Label>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressModal;
