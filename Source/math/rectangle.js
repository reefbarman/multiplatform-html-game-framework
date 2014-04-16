function Rectangle(nX, nY, nWidth, nHeight)
{
    this.X = nX || 0;
    this.Y = nY || 0;
    this.Width = nWidth || 0;
    this.Height = nHeight || 0;
}

EN.Rectangle = Rectangle;
//# sourceURL=engine/rendering/rectangle.js