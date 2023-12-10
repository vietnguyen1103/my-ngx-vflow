import { VDocBlockComponent } from "../components/vdoc-block/vdoc-block.component";
import { BlockStyleSheet } from "../interfaces/stylesheet.interface";
import { AnyViewModel } from "./any.view-model";

export class BlockViewModel extends AnyViewModel {
  public width = 0
  public height = 0
  public x = 0
  public y = 0

  constructor(
    public readonly component: VDocBlockComponent,
    public readonly styleSheet: BlockStyleSheet
  ) {
    super();
  }

  calculateLayout() {
    // we need to know layout of children before we compute parent layout
    this.children.forEach(c => c.calculateLayout())

    this.setPosition()
    this.setHeight()

    this.setWidth()
    // we need to set child's width by parent
    // because parent's width which is use by child must be computed first (call before this comment)
    this.children.filter(isBlock).forEach(b => b.setWidth())
  }

  private setPosition() {
    // TODO maybe override parent in this class, because block always have parent
    if (!this.parent) return

    const prevSibling = this.parent.children[this.parent.children.indexOf(this) - 1]

    if (prevSibling && prevSibling instanceof BlockViewModel) {
      this.y = prevSibling.y + prevSibling.height + prevSibling.styleSheet.marginBottom
    }
  }

  /**
   * Set height for view
   */
  private setHeight() {
    if (this.styleSheet.height) {
      // if styles has height, use it

      this.height = this.styleSheet.height
    } else {
      // otherwise compute height based on children

      let height = 0

      for (const c of this.children) {
        if (c instanceof BlockViewModel) {
          height += c.height
          height += c.styleSheet.marginBottom
        }
      }

      this.height = height
    }
  }

  /**
   * Set width for view
   */
  protected setWidth() {
    if (this.styleSheet.width) {
      this.width = this.styleSheet.width
    } else {
      this.width = this.parent?.width ?? 0
    }
  }
}

export function isBlock(model: AnyViewModel): model is BlockViewModel {
  return model instanceof BlockViewModel
}
