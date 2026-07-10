import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[popover]',
})
export class PopoverDirective implements OnDestroy {
  @Input('popover') content: string;
  @Input() popoverTitle: string;
  @Input() popoverPlacement: string = 'auto top';
  @Input() popoverOnHover: boolean = false;

  private tooltip: HTMLElement = null;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('mouseenter')
  @HostListener('focusin')
  showOnHover(): void {
    if (this.popoverOnHover) {
      this.show();
    }
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  hideOnHover(): void {
    if (this.popoverOnHover) {
      this.hide();
    }
  }

  @HostListener('click')
  toggleOnClick(): void {
    if (this.popoverOnHover) {
      return;
    }
    this.tooltip ? this.hide() : this.show();
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private show(): void {
    if (this.tooltip || !this.content) {
      return;
    }

    this.tooltip = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltip, 'igsr-popover');
    this.applyTooltipStyles(this.tooltip);

    if (this.popoverTitle) {
      const title = this.renderer.createElement('div');
      this.renderer.setStyle(title, 'font-weight', '600');
      this.renderer.setStyle(title, 'margin-bottom', '4px');
      this.renderer.appendChild(title, this.renderer.createText(this.popoverTitle));
      this.renderer.appendChild(this.tooltip, title);
    }

    const body = this.renderer.createElement('div');
    this.renderer.appendChild(body, this.renderer.createText(this.content));
    this.renderer.appendChild(this.tooltip, body);
    this.renderer.appendChild(document.body, this.tooltip);
    this.positionTooltip();
  }

  private hide(): void {
    if (!this.tooltip) {
      return;
    }
    this.renderer.removeChild(document.body, this.tooltip);
    this.tooltip = null;
  }

  private positionTooltip(): void {
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const topPlacement = (this.popoverPlacement || '').indexOf('top') !== -1;
    const viewportPadding = 8;

    let top = topPlacement
      ? hostRect.top + window.pageYOffset - tooltipRect.height - viewportPadding
      : hostRect.bottom + window.pageYOffset + viewportPadding;
    let left = hostRect.left + window.pageXOffset + (hostRect.width - tooltipRect.width) / 2;

    left = Math.max(viewportPadding, Math.min(left, window.pageXOffset + document.documentElement.clientWidth - tooltipRect.width - viewportPadding));
    top = Math.max(viewportPadding, top);

    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }

  private applyTooltipStyles(element: HTMLElement): void {
    this.renderer.setStyle(element, 'position', 'absolute');
    this.renderer.setStyle(element, 'z-index', '10000');
    this.renderer.setStyle(element, 'max-width', '280px');
    this.renderer.setStyle(element, 'padding', '8px 10px');
    this.renderer.setStyle(element, 'border-radius', '4px');
    this.renderer.setStyle(element, 'background', '#262626');
    this.renderer.setStyle(element, 'color', '#fff');
    this.renderer.setStyle(element, 'font-size', '12px');
    this.renderer.setStyle(element, 'line-height', '1.35');
    this.renderer.setStyle(element, 'box-shadow', '0 2px 8px rgba(0, 0, 0, 0.25)');
    this.renderer.setStyle(element, 'pointer-events', 'none');
  }
}
