import {ConnectedPosition, Overlay, OverlayPositionBuilder, OverlayRef, PositionStrategy} from '@angular/cdk/overlay';
import {ComponentPortal, ComponentType} from '@angular/cdk/portal';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentRef,
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    ViewRef,
} from '@angular/core';

@Directive({
    selector: '[cachedComponentTooltip] ',
})
// See https://blog.angularindepth.com/building-tooltips-for-angular-3cdaac16d138
export class CachedComponentTooltipDirective implements AfterViewInit, OnDestroy {
    @Input('componentTooltipCssClass') cssClass: string;
    @Input('componentTooltipPosition') position: 'bottom' | 'right' | 'left' | 'top' | 'auto' = 'right';
    private viewInit = false;
    private tooltipPortal;
    private overlayRef: OverlayRef;
    private positionStrategy: PositionStrategy;
    private positionDirty = true;
    private tooltipRef: ComponentRef<any>;

    constructor(
        private overlayPositionBuilder: OverlayPositionBuilder,
        private elementRef: ElementRef,
        private overlay: Overlay,
        private cdr: ChangeDetectorRef,
    ) {
    }

    private _componentInput: any;

    @Input() set componentInput(value: any) {
        this._componentInput = value;
        if (value && value !== this._componentInput) {
            this.updatePositionStrategy();
        }
    }

    private _componentType: ComponentType<any>;

    @Input() set componentType(value: ComponentType<any>) {
        this._componentType = value;
        if (value && value !== this._componentType) {
            this.updatePositionStrategy();
        }
    }

    ngAfterViewInit() {
        this.viewInit = true;
    }

    @HostListener('window:beforeunload')
    ngOnDestroy() {
        this.tooltipRef = null;
        if (this.overlayRef) {
            this.overlayRef.detach();
        }
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        if (this.positionDirty) {
            this.updatePositionStrategy();
            this.positionDirty = false;
        }
        if (!this.tooltipRef) {
            // Create tooltip portal
            this.tooltipPortal = new ComponentPortal(this._componentType);

            // Attach tooltip portal to overlay
            this.tooltipRef = this.overlayRef.attach(this.tooltipPortal);

            // Pass content to tooltip component instance
            this.tooltipRef.instance.config = this._componentInput;
            this.tooltipRef.instance.cssClass = this.cssClass;
            console.debug('setting css class', this.cssClass, this.tooltipRef.instance);
        }
        this.tooltipRef.instance.visible = true;
        this.positionStrategy.apply();

        // if (!(this.cdr as ViewRef)?.destroyed) {
        // 	this.cdr.detectChanges();
        // }
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (!this.tooltipRef?.instance) {
            return;
        }

        this.tooltipRef.instance.visible = false;
        // if (!(this.cdr as ViewRef)?.destroyed) {
        // 	this.cdr.detectChanges();
        // }
    }

    @HostListener('window:mousewheel')
    onScroll() {
        if (!this.tooltipRef?.instance) {
            return;
        }

        this.tooltipRef.instance.visible = false;
        // if (!(this.cdr as ViewRef)?.destroyed) {
        // 	this.cdr.detectChanges();
        // }
    }

    private updatePositionStrategy() {
        if (!this.viewInit || !this._componentInput || !this._componentType) {
            console.warn('not ready yet', this.viewInit, this._componentInput, this._componentType);
            return;
        }
        if (this.positionStrategy) {
            this.positionStrategy.detach();
            this.positionStrategy.dispose();
            this.positionStrategy = null;
        }
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
        }
        const positions: ConnectedPosition[] = this.buildPositions();
        this.positionStrategy = this.overlayPositionBuilder
            // Create position attached to the elementRef
            .flexibleConnectedTo(this.elementRef)
            // Describe how to connect overlay to the elementRef
            .withPositions(positions);

        // Connect position strategy
        this.overlayRef = this.overlay.create({positionStrategy: this.positionStrategy});

        if (!(this.cdr as ViewRef)?.destroyed) {
            this.cdr.detectChanges();
        }
    }

    private buildPositions(): ConnectedPosition[] {
        switch (this.position) {
            case 'left':
                return [
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    },
                ];
            case 'bottom':
                return [
                    {
                        originX: 'center',
                        originY: 'bottom',
                        overlayX: 'center',
                        overlayY: 'top',
                    },
                ];
            case 'top':
                return [
                    {
                        originX: 'center',
                        originY: 'top',
                        overlayX: 'center',
                        overlayY: 'bottom',
                    },
                ];
            case 'right':
                return [
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                ];
            case 'auto':
            default:
                return [
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                ];
        }
    }
}
