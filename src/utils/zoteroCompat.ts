/**
 * Zotero 10 removed singular collection/library selection getters.
 * These helpers prefer the plural APIs and fall back for Zotero 7–9.
 */

function getPane() {
  return Zotero.getActiveZoteroPane();
}

export function getSelectedCollections(): Zotero.Collection[] {
  const pane = getPane() as ReturnType<typeof Zotero.getActiveZoteroPane> & {
    getSelectedCollections?: (asID?: false) => Zotero.Collection[];
    getSelectedCollection?: (asID?: false) => Zotero.Collection | false | undefined;
  };
  if (!pane) return [];
  if (typeof pane.getSelectedCollections === "function") {
    try {
      return pane.getSelectedCollections(false) || [];
    } catch {
      // fall through
    }
  }
  const selected = pane.getSelectedCollection?.(false);
  return selected ? [selected] : [];
}

export function getSelectedCollection(): Zotero.Collection | undefined {
  return getSelectedCollections()[0];
}

export function getSelectedCollectionID(): number | false {
  const collection = getSelectedCollection();
  return collection ? collection.id : false;
}

export function getSelectedLibraryIDs(): number[] {
  const pane = getPane() as ReturnType<typeof Zotero.getActiveZoteroPane> & {
    getSelectedLibraryIDs?: () => number[];
    getSelectedLibraryID?: () => number;
  };
  if (!pane) return [];
  if (typeof pane.getSelectedLibraryIDs === "function") {
    try {
      return pane.getSelectedLibraryIDs() || [];
    } catch {
      // fall through
    }
  }
  const id = pane.getSelectedLibraryID?.();
  return typeof id === "number" ? [id] : [];
}

export function getSelectedLibraryID(): number {
  return getSelectedLibraryIDs()[0] ?? Zotero.Libraries.userLibraryID;
}
