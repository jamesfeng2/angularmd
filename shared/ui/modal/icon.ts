`
Modal 内部使用 Icon-only Button（关闭按钮）
你可以在 modal header 放一个 icon-only 按钮：

html
<div header class="modal-header">
  Edit Profile

  <app-button
    iconOnly="true"
    iconLeft="fa fa-times"
    variant="text"
    (clicked)="editOpen = false"
  ></app-button>
</div>
Modal 的 CSS：

css
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

`