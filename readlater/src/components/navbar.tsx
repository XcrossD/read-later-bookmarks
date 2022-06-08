import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  ControlGroup,
  InputGroup,
  Alignment,
  Classes,
  Menu,
  MenuItem,
  Toaster,
  Position,
  ButtonGroup,
} from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";

interface INavProps {
  searchKeyword: string;
  setSearchKeyword(s: string): void;
  newestFirst: boolean;
  setNewestFirst(b: boolean): void;
  bulkEdit: boolean;
  setBulkEdit(b: boolean): void;
  toaster: Toaster | null;
}

const Nav = (props: INavProps) => {
  
  const handleArchive = () => {

  };

  const handleDelete = () => {

  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setSearchKeyword(e.target.value.toLowerCase());
  };

  const handleSearchClear = () => {
    props.setSearchKeyword('');
  };

  const sortMenu = (
    <Menu>
      <MenuItem icon="sort-asc" text="Oldest first" onClick={() => props.setNewestFirst(false)}/>
      <MenuItem icon="sort-desc" text="Newest first" onClick={() => props.setNewestFirst(true)}/>
    </Menu>
  );

  const searchClear = (
    <Button
      className={Classes.MINIMAL}
      icon="cross"
      onClick={handleSearchClear}
      minimal
    />
  );

  return (
    <Navbar className="navbar-fix-top">
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>Read Later Bookmarks</NavbarHeading>
        {props.bulkEdit ? (
          <ButtonGroup>
            <Button
              icon="archive"
              className={Classes.BUTTON}
              text="Archive"
              onClick={handleArchive}
            />
            {/* <Button
              icon="export"
              className={Classes.BUTTON}
              onClick={handleShare}
            /> */}
            <Button
              icon="trash"
              className={Classes.BUTTON}
              text="Delete"
              onClick={handleDelete}  
            />
          </ButtonGroup>
        ) : (
          <ControlGroup>
            <InputGroup
                leftIcon="search"
                placeholder="Search bookmarks"
                onChange={handleSearchChange}
                rightElement={props.searchKeyword.length > 0 ? searchClear : undefined}
                value={props.searchKeyword}
            />
          </ControlGroup>
        )}
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        {/* <Button className={Classes.MINIMAL} icon="document" text="Tag" /> */}
        <Popover2 content={sortMenu} placement="auto">
          <Button className={Classes.MINIMAL} icon={props.newestFirst ? "sort-desc" : "sort-asc"} text="Sort" />
        </Popover2>
        {props.bulkEdit ? (
          <ButtonGroup>
            <Button
              className={Classes.MINIMAL}
              text={"Clear"}
              onClick={() => {}}
            />
            <Button
              className={Classes.MINIMAL}
              icon="cross"
              onClick={() => props.setBulkEdit(false)}
            />
          </ButtonGroup>
        ) : (
          <Button
            className={Classes.MINIMAL}
            icon="edit"
            text="Bulk edit"
            onClick={() => props.setBulkEdit(true)}
          />
        )}
      </NavbarGroup>
    </Navbar>
  )  
}

export default Nav;